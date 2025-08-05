import { View } from 'react-native';
import { Switch, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import NextReminderText from '../../lib/components/NextReminderText';
import { useSettingsStore } from '../../lib/hooks/useSettingsStore';

export default function Settings() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const toggleReminders = useSettingsStore((s) => s.toggleReminders);
  const reminderHoursDay = useSettingsStore((s) => s.reminderHoursDay);
  const reminderHoursNight = useSettingsStore((s) => s.reminderHoursNight);
  const setReminderHoursDay = useSettingsStore((s) => s.setReminderHoursDay);
  const setReminderHoursNight = useSettingsStore((s) => s.setReminderHoursNight);

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
        mode="outlined"
        label="Reminder hours (day)"
        value={String(reminderHoursDay)}
        onChangeText={(text) => setReminderHoursDay(Number(text))}
        keyboardType="numeric"
      />

      <TextInput
        mode="outlined"
        label="Reminder hours (night)"
        value={String(reminderHoursNight)}
        onChangeText={(text) => setReminderHoursNight(Number(text))}
        keyboardType="numeric"
      />
    </SafeAreaView>
  );
}
