import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, type TextInput as TextInputRN, View } from 'react-native';
import { Button, Divider, Icon, Switch, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import NextReminderText from '../../lib/components/NextReminderText';
import { formatTimeHM } from '../../lib/date';
import { useResetFirstTime } from '../../lib/hooks/useFirstTimeUser';
import { useRatingPrompt } from '../../lib/hooks/useRatingPrompt';
import { useSettingsStore } from '../../lib/hooks/useSettingsStore';
import i18n from '../../lib/i18n';
import { scheduleNextPumpReminder } from '../../lib/reminders';

const isValidInput = (dayHoursStr: string, nightHoursStr: string) => {
  const dayHours = Number(dayHoursStr);
  const nightHours = Number(nightHoursStr);
  return dayHours > 0 && nightHours > 0 && !Number.isNaN(dayHours) && !Number.isNaN(nightHours);
};

export default function Settings() {
  const router = useRouter();

  const localDayHoursInputRef = useRef<TextInputRN>(null);
  const localNightHoursInputRef = useRef<TextInputRN>(null);
  const resetFirstTime = useResetFirstTime();
  const { showRatingPrompt } = useRatingPrompt();

  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const toggleReminders = useSettingsStore((s) => s.toggleReminders);
  const reminderHoursDay = useSettingsStore((s) => s.reminderHoursDay);
  const reminderHoursNight = useSettingsStore((s) => s.reminderHoursNight);
  const updateReminderIntervals = useSettingsStore((s) => s.updateReminderIntervals);
  const nightStartMinutes = useSettingsStore((s) => s.nightStartMinutes);
  const nightEndMinutes = useSettingsStore((s) => s.nightEndMinutes);

  const [localDayHours, setLocalDayHours] = useState(String(reminderHoursDay));
  const [localNightHours, setLocalNightHours] = useState(String(reminderHoursNight));

  const hasChanges =
    Number(localDayHours) !== reminderHoursDay || Number(localNightHours) !== reminderHoursNight;

  const handleSaveIntervals = () => {
    if (!isValidInput(localDayHours, localNightHours)) {
      return;
    }

    updateReminderIntervals(Number(localDayHours), Number(localNightHours));
    scheduleNextPumpReminder();

    localDayHoursInputRef.current?.blur();
    localNightHoursInputRef.current?.blur();
  };

  const handleResetIntervals = () => {
    setLocalDayHours(String(reminderHoursDay));
    setLocalNightHours(String(reminderHoursNight));

    localDayHoursInputRef.current?.blur();
    localNightHoursInputRef.current?.blur();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text variant="titleMedium">{i18n.t('settings.reminders')}</Text>

        <View style={styles.switchRow}>
          <Text>{i18n.t('settings.useReminders')}</Text>

          <Switch value={remindersEnabled} onValueChange={toggleReminders} />
        </View>

        <View style={styles.remindersSection}>
          <NextReminderText />

          <View style={styles.nightRow}>
            <Text>
              {i18n.t('settings.nightIntervalSummary', {
                start: formatTimeHM(Math.floor(nightStartMinutes / 60), nightStartMinutes % 60),
                end: formatTimeHM(Math.floor(nightEndMinutes / 60), nightEndMinutes % 60),
              })}
            </Text>

            <Button compact onPress={() => router.push('/night-time-modal')}>
              {i18n.t('settings.changeNightInterval')}
            </Button>
          </View>

          <TextInput
            ref={localDayHoursInputRef}
            mode="outlined"
            label={i18n.t('settings.dayReminders')}
            value={localDayHours}
            onChangeText={setLocalDayHours}
            keyboardType="numeric"
            right={<TextInput.Icon icon="white-balance-sunny" />}
            error={
              localDayHours !== '' &&
              (Number.isNaN(Number(localDayHours)) || Number(localDayHours) <= 0)
            }
          />

          <TextInput
            ref={localNightHoursInputRef}
            mode="outlined"
            label={i18n.t('settings.nightReminders')}
            value={localNightHours}
            onChangeText={setLocalNightHours}
            keyboardType="numeric"
            right={<TextInput.Icon icon="moon-waning-crescent" />}
            error={
              localNightHours !== '' &&
              (Number.isNaN(Number(localNightHours)) || Number(localNightHours) <= 0)
            }
          />

          {hasChanges && (
            <View style={styles.buttonRow}>
              <Button mode="outlined" onPress={handleResetIntervals} style={styles.button}>
                {i18n.t('settings.cancelChanges')}
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveIntervals}
                disabled={!isValidInput(localDayHours, localNightHours)}
                style={styles.button}
              >
                {i18n.t('settings.saveChanges')}
              </Button>
            </View>
          )}
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.privacySection}>
        <Text variant="titleMedium">{i18n.t('settings.privacy.title')}</Text>

        <View style={styles.privacyRow}>
          <Icon source="shield-check" size={20} />
          <View style={styles.privacyTextContainer}>
            <Text variant="bodyMedium">{i18n.t('settings.privacy.localStorage')}</Text>
            <Text variant="bodySmall" style={styles.privacyDescription}>
              {i18n.t('settings.privacy.localStorageDesc')}
            </Text>
          </View>
        </View>

        <View style={styles.privacyRow}>
          <Icon source="cellphone-lock" size={20} />
          <View style={styles.privacyTextContainer}>
            <Text variant="bodyMedium">{i18n.t('settings.privacy.dataOwnership')}</Text>
            <Text variant="bodySmall" style={styles.privacyDescription}>
              {i18n.t('settings.privacy.dataOwnershipDesc')}
            </Text>
          </View>
        </View>

        <Button mode="outlined" onPress={showRatingPrompt} style={styles.ratingButton}>
          {i18n.t('rating.settingsButton')}
        </Button>

        {__DEV__ && (
          <Button mode="outlined" onPress={resetFirstTime} style={styles.welcomeButton}>
            {i18n.t('settings.privacy.showWelcomeAgain')}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: COLORS.background,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remindersSection: {
    gap: 16,
  },
  nightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  privacySection: {
    gap: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyDescription: {
    opacity: 0.7,
  },
  ratingButton: {
    marginTop: 8,
  },
  welcomeButton: {
    marginTop: 8,
  },
});
