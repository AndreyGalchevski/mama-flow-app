import { useRef, useState } from 'react';
import { type TextInput as TextInputRN, View } from 'react-native';
import { Button, Switch, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import NextReminderText from '../../lib/components/NextReminderText';
import { useSettingsStore } from '../../lib/hooks/useSettingsStore';
import { scheduleNextPumpReminder } from '../../lib/reminders';

const isValidInput = (dayHoursStr: string, nightHoursStr: string) => {
  const dayHours = Number(dayHoursStr);
  const nightHours = Number(nightHoursStr);
  return dayHours > 0 && nightHours > 0 && !Number.isNaN(dayHours) && !Number.isNaN(nightHours);
};

export default function Settings() {
  const localDayHoursInputRef = useRef<TextInputRN>(null);
  const localNightHoursInputRef = useRef<TextInputRN>(null);

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
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text>Reminders</Text>

          <Switch value={remindersEnabled} onValueChange={toggleReminders} />
        </View>

        <NextReminderText />
      </View>

      <TextInput
        ref={localDayHoursInputRef}
        mode="outlined"
        label="Hours between daytime reminders"
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
        label="Hours between nighttime reminders"
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
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveIntervals}
            disabled={!isValidInput(localDayHours, localNightHours)}
            style={{ flex: 1 }}
          >
            Save Changes
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
