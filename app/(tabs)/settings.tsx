import { useRef, useState } from 'react';
import { type TextInput as TextInputRN, View } from 'react-native';
import { Button, Divider, Icon, Switch, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import NextReminderText from '../../lib/components/NextReminderText';
import { useResetFirstTime } from '../../lib/hooks/useFirstTimeUser';
import { useSettingsStore } from '../../lib/hooks/useSettingsStore';
import i18n from '../../lib/i18n';
import { scheduleNextPumpReminder } from '../../lib/reminders';

const isValidInput = (dayHoursStr: string, nightHoursStr: string) => {
  const dayHours = Number(dayHoursStr);
  const nightHours = Number(nightHoursStr);
  return dayHours > 0 && nightHours > 0 && !Number.isNaN(dayHours) && !Number.isNaN(nightHours);
};

export default function Settings() {
  const localDayHoursInputRef = useRef<TextInputRN>(null);
  const localNightHoursInputRef = useRef<TextInputRN>(null);
  const resetFirstTime = useResetFirstTime();

  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const toggleReminders = useSettingsStore((s) => s.toggleReminders);
  const reminderHoursDay = useSettingsStore((s) => s.reminderHoursDay);
  const reminderHoursNight = useSettingsStore((s) => s.reminderHoursNight);
  const updateReminderIntervals = useSettingsStore((s) => s.updateReminderIntervals);

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
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: COLORS.background,
      }}
    >
      <View>
        <Text variant="titleMedium">{i18n.t('settings.reminders')}</Text>

        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text>{i18n.t('settings.useReminders')}</Text>

          <Switch value={remindersEnabled} onValueChange={toggleReminders} />
        </View>

        <View style={{ gap: 16 }}>
          <NextReminderText />

          <TextInput
            ref={localDayHoursInputRef}
            mode="outlined"
            label={i18n.t('settings.dayReminders')}
            value={localDayHours}
            onChangeText={setLocalDayHours}
            keyboardType="numeric"
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
            error={
              localNightHours !== '' &&
              (Number.isNaN(Number(localNightHours)) || Number(localNightHours) <= 0)
            }
          />

          {hasChanges && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button mode="outlined" onPress={handleResetIntervals} style={{ flex: 1 }}>
                {i18n.t('settings.cancelChanges')}
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveIntervals}
                disabled={!isValidInput(localDayHours, localNightHours)}
                style={{ flex: 1 }}
              >
                {i18n.t('settings.saveChanges')}
              </Button>
            </View>
          )}
        </View>
      </View>

      <Divider style={{ marginVertical: 8 }} />

      <View style={{ gap: 12 }}>
        <Text variant="titleMedium">{i18n.t('settings.privacy.title')}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon source="shield-check" size={20} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium">{i18n.t('settings.privacy.localStorage')}</Text>
            <Text variant="bodySmall" style={{ opacity: 0.7 }}>
              {i18n.t('settings.privacy.localStorageDesc')}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon source="cellphone-lock" size={20} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium">{i18n.t('settings.privacy.dataOwnership')}</Text>
            <Text variant="bodySmall" style={{ opacity: 0.7 }}>
              {i18n.t('settings.privacy.dataOwnershipDesc')}
            </Text>
          </View>
        </View>

        {__DEV__ && (
          <Button mode="outlined" onPress={resetFirstTime} style={{ marginTop: 8 }}>
            {i18n.t('settings.privacy.showWelcomeAgain')}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
