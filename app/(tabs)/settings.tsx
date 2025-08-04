import { View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import NextReminderText from '../../lib/components/NextReminderText';
import { useSettingsStore } from '../../lib/hooks/useSettingsStore';

export default function Settings() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const toggleReminders = useSettingsStore((s) => s.toggleReminders);

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
    </SafeAreaView>
  );
}
